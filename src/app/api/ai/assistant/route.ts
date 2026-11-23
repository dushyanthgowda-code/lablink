import { NextRequest, NextResponse } from 'next/server';
import { AssistantMessageSchema } from '@/lib/validation';
import { INITIAL_EQUIPMENT } from '@/data/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = AssistantMessageSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Validation failed', details: validated.error.format() }, { status: 400 });
    }

    const { message, contextEquipmentId } = validated.data;
    const lower = message.toLowerCase();

    let reply = '';
    const relevantEquipment = contextEquipmentId 
      ? INITIAL_EQUIPMENT.find(e => e.id === contextEquipmentId)
      : null;

    if (relevantEquipment) {
      if (lower.includes('prereq') || lower.includes('safety') || lower.includes('training') || lower.includes('cert')) {
        reply = `**Prerequisites for ${relevantEquipment.name}:**\n` +
          relevantEquipment.prerequisites.map(p => `• ${p}`).join('\n') +
          `\n\n**Safety Classification:** ${relevantEquipment.safetyLevel}. Ensure you carry your safety badge and student ID to ${relevantEquipment.building}.`;
      } else if (lower.includes('spec') || lower.includes('detail') || lower.includes('feature')) {
        reply = `**Key Specifications for ${relevantEquipment.name}:**\n` +
          Object.entries(relevantEquipment.specifications).map(([k, v]) => `• **${k}:** ${v}`).join('\n') +
          `\n\n**Location:** ${relevantEquipment.building} (${relevantEquipment.department} Dept).`;
      } else {
        reply = `${relevantEquipment.name} is situated in ${relevantEquipment.labName} (${relevantEquipment.building}). Currently ${relevantEquipment.status} with a ${relevantEquipment.utilizationScore}% utilization rate. Would you like to request an open slot or check prerequisite certifications?`;
      }
    } else {
      // General Campus Lab Inquiries
      if (lower.includes('conflict') || lower.includes('fair') || lower.includes('priority')) {
        reply = `**How LabLink's AI Conflict Resolution Engine Works:**\n` +
          `When two students request overlapping slots for specialised gear, LabLink evaluates the **Fairness & Feasibility Index (FFI)** based on:\n` +
          `1. **Project Deadline Urgency (40%)**: Projects with imminent deadlines (e.g. within 3-5 days) receive higher urgency weighting.\n` +
          `2. **Academic Project Tier (35%)**: Final-year Capstone / M.Tech / PhD research vs routine weekly coursework.\n` +
          `3. **Historical Usage Fairness (25%)**: Prior usage this week is inverted to prevent resource monopolization.\n\n` +
          `Students who do not receive their requested slot are automatically suggested a feasible non-conflicting afternoon slot or alternative cross-department equipment!`;
      } else if (lower.includes('gpu') || lower.includes('llm') || lower.includes('deep learning') || lower.includes('train')) {
        reply = `For AI and deep learning workloads, we have two top-tier campus resources:\n` +
          `1. **NVIDIA DGX Station A100** (CSE Dept - 4x 80GB SXM4 GPUs, 320GB VRAM) for large language models and distributed PyTorch training.\n` +
          `2. **NVIDIA Jetson AGX Orin 64GB** (CSE Dept - 275 TOPS) for edge AI, TensorRT inference, and autonomous robotics.\n\n` +
          `You can filter by CSE department to view live availability and request slots.`;
      } else if (lower.includes('rf') || lower.includes('antenna') || lower.includes('frequency') || lower.includes('pcb')) {
        reply = `For high frequency and telecom prototypes, check out the **Keysight E5071C 20GHz Vector Network Analyzer** in Maxwell Telecom Building (ECE Dept). It supports 4-port S-parameter characterization and impedance smith charts up to 20 GHz.`;
      } else if (lower.includes('microscop') || lower.includes('nano') || lower.includes('materials') || lower.includes('surface')) {
        reply = `For nanoscale characterization and specimen analysis, the **FEI Quanta 200 SEM** in Raman Nanotech Wing provides imaging down to 1.2nm resolution. Remember to ensure you have the 'Radiation & Vacuum Safety Cert Level 2' before booking!`;
      } else if (lower.includes('3d') || lower.includes('print') || lower.includes('resin') || lower.includes('bio')) {
        reply = `The **Formlabs Form 3B+ Medical Grade SLA 3D Printer** in Franklin Bioengineering Center (Biotech Dept) is optimized for microfluidics, dental models, and biocompatible resins with 25-micron XY resolution.`;
      } else {
        reply = `Hello! I am your **LabLink Campus Copilot**. I can help you:\n` +
          `• Discover specialised equipment across CSE, ECE, Mechanical, Biotech, Robotics & Materials Science.\n` +
          `• Check laboratory safety requirements and certifications.\n` +
          `• Explain slot booking, project deadline prioritization, and AI conflict resolution.\n` +
          `• Recommend alternative equipment when high-demand workstations are busy.\n\n` +
          `What experiment or project are you working on today?`;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: 'Assistant failed to generate response', message }, { status: 500 });
  }
}
