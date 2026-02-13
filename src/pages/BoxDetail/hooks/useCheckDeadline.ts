import type { BoxDetailData, DeadlineCheckStateType } from '../types/boxDetailData';
import { PROTOCOL_CONSTANTS } from '@dapp/config/contractsConfig';

export const useCheckDeadline = (box: BoxDetailData): DeadlineCheckStateType | undefined => {

    if (!box) {
        return undefined;
    }

    const {
        deadline,
        request_refund_deadline,
        review_deadline,
    } = box;

    let isInDeadline = false;
    let isInRequestRefundDeadline = true;
    let isInReviewRefundDeadline = true;

    const now = Math.floor(Date.now() / 1000);

    if (deadline) {
        isInDeadline = Number(deadline) > now;
    }
    if (request_refund_deadline) {
        isInRequestRefundDeadline = Number(request_refund_deadline) > now;
    }
    if (review_deadline) {
        isInReviewRefundDeadline = Number(review_deadline) > now;
    }

    const isInExtendDeadlineTimeWindow = now > Number(deadline) - PROTOCOL_CONSTANTS.deadlineExtensionWindow;

    return {
        isInRequestRefundDeadline: isInRequestRefundDeadline,
        isInReviewRefundDeadline: isInReviewRefundDeadline,
        isInDeadline: isInDeadline,
        isInExtendDeadlineTimeWindow: isInExtendDeadlineTimeWindow,
    };
}
