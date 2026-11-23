import { SlotBooking, ConflictCase, Equipment } from '../types';
import { INITIAL_EQUIPMENT } from '../data/mockData';

export interface EvaluatedContender {
  booking: SlotBooking;
  priorHoursThisWeek: number;
  urgencyScore: number;
  deadlineScore: number;
  fairnessScore: number;
  totalScore: number;
  scoreBreakdown: {
    deadlineWeight: string;
    tierWeight: string;
    fairnessWeight: string;
  };
}

export interface ConflictResolutionPlan {
  conflictId: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  timeSlot: string;
  winningBooking: SlotBooking;
  winningScore: number;
  resolutionJustification: string;
  runnerUps: {
    booking: SlotBooking;
    score: number;
    recommendedAlternative: {
      type: 'reschedule_same_equipment' | 'alternative_equipment' | 'split_time_sharing';
      equipmentId: string;
      equipmentName: string;
      date: string;
      suggestedSlot: string;
      explanation: string;
    };
  }[];
}

export function evaluateContenderFairness(
  booking: SlotBooking,
  priorHoursThisWeek: number = 0,
  currentEvaluationDate: string = '2026-11-23'
): EvaluatedContender {
  // 1. Urgency Tier Score (0 to 35)
  let urgencyScore = 10;
  if (booking.urgencyLevel === 'Critical Capstone') urgencyScore = 35;
  else if (booking.urgencyLevel === 'High') urgencyScore = 22;

  // 2. Deadline Urgency Score (0 to 40)
  // Closer deadline = higher urgency
  const curDate = new Date(currentEvaluationDate).getTime();
  const deadlineDate = new Date(booking.projectDeadline).getTime();
  const diffDays = Math.max(0, Math.round((deadlineDate - curDate) / (1000 * 60 * 60 * 24)));
  
  let deadlineScore = 10;
  if (diffDays <= 2) deadlineScore = 40;
  else if (diffDays <= 5) deadlineScore = 32;
  else if (diffDays <= 10) deadlineScore = 24;
  else if (diffDays <= 20) deadlineScore = 16;
  else deadlineScore = 8;

  // 3. Fairness Inversion Score (0 to 25)
  // Penalize students who already consumed 8+ hours this week to give equal opportunity to all
  const fairnessScore = Math.max(0, Math.min(25, 25 - (priorHoursThisWeek * 2.5)));

  const totalScore = Math.min(100, urgencyScore + deadlineScore + fairnessScore);

  return {
    booking,
    priorHoursThisWeek,
    urgencyScore,
    deadlineScore,
    fairnessScore,
    totalScore,
    scoreBreakdown: {
      deadlineWeight: `${deadlineScore} pts (${diffDays} days to deadline: ${booking.projectDeadline})`,
      tierWeight: `${urgencyScore} pts (${booking.urgencyLevel})`,
      fairnessWeight: `${fairnessScore} pts (${priorHoursThisWeek} hrs used previously this week)`
    }
  };
}

export function resolveConflictIntelligently(
  equipmentId: string,
  conflictingBookings: SlotBooking[],
  priorUsageMap: Record<string, number> = {},
  evaluationDate: string = '2026-11-23'
): ConflictResolutionPlan {
  const equipment = INITIAL_EQUIPMENT.find(e => e.id === equipmentId);
  const eqName = equipment?.name || 'Laboratory Resource';

  // Evaluate each contender
  const evaluatedContenders: EvaluatedContender[] = conflictingBookings.map(b => {
    const priorHours = priorUsageMap[b.studentId] ?? (b.urgencyLevel === 'Normal' ? 6 : 2);
    return evaluateContenderFairness(b, priorHours, evaluationDate);
  });

  // Sort descending by total score
  evaluatedContenders.sort((a, b) => b.totalScore - a.totalScore);

  const winner = evaluatedContenders[0];
  const otherContenders = evaluatedContenders.slice(1);

  // Generate justification
  const justification = `AI Fair Allocation Engine awarded slot to ${winner.booking.studentName} (Score: ${winner.totalScore}/100). Key determining factors: ${winner.scoreBreakdown.tierWeight}, ${winner.scoreBreakdown.deadlineWeight}, and fair distribution quota (${winner.scoreBreakdown.fairnessWeight}).`;

  // Find feasible alternatives for runners-up
  const runnerUps = otherContenders.map(c => {
    // Check if there is an alternative piece of equipment in another or same department
    const altEq = INITIAL_EQUIPMENT.find(e => 
      e.id !== equipmentId && 
      (e.department === c.booking.department || e.category === equipment?.category) &&
      e.status === 'available'
    );

    let altPlan: ConflictResolutionPlan['runnerUps'][0]['recommendedAlternative'];

    if (altEq) {
      altPlan = {
        type: 'alternative_equipment',
        equipmentId: altEq.id,
        equipmentName: altEq.name,
        date: c.booking.date,
        suggestedSlot: `${c.booking.startTime} - ${c.booking.endTime}`,
        explanation: `Redirect to equivalent resource in ${altEq.department} (${altEq.building}) with 0 waiting time.`
      };
    } else {
      altPlan = {
        type: 'reschedule_same_equipment',
        equipmentId: equipmentId,
        equipmentName: eqName,
        date: c.booking.date,
        suggestedSlot: '14:30 - 17:30 (Afternoon Open Window)',
        explanation: `Shift to same-day afternoon window without delaying project schedule (${c.booking.projectDeadline}).`
      };
    }

    return {
      booking: c.booking,
      score: c.totalScore,
      recommendedAlternative: altPlan
    };
  });

  return {
    conflictId: `conf-${Date.now().toString().slice(-4)}`,
    equipmentId,
    equipmentName: eqName,
    date: conflictingBookings[0]?.date || '2026-11-25',
    timeSlot: `${conflictingBookings[0]?.startTime || '10:00'} - ${conflictingBookings[0]?.endTime || '13:00'}`,
    winningBooking: winner.booking,
    winningScore: winner.totalScore,
    resolutionJustification: justification,
    runnerUps
  };
}
