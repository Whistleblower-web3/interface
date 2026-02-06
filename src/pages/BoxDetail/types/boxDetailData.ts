
/**
 * Converted Box data (contains nested related data)
 * Used for front-end display, containing User objects and Token objects
 */
import type { BoxUnifiedType } from '@dapp/services/supabase/types/types';

export type BoxDetailData = BoxUnifiedType;

export interface DeadlineCheckStateType {
    isInRequestRefundDeadline: boolean,
    isInReviewRefundDeadline: boolean,
    isInDeadline: boolean,
    isInExtendDeadlineTimeWindow: boolean,
    
}

// const initialDeadlineCheckState: DeadlineCheckStateType = {
//     isInRequestRefundDeadline: true,
//     isInReviewRefundDeadline: true,
//     isInDeadline: false,
//     completeOrderDeadline: 0,
// }
