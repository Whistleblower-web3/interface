import { boxStatusMap_string } from "@dapp/types/typesDapp/contracts/truthBox";

/**
 * 
 * Calculate Box status based on contract logic
 * 
 * Refer to the implementation logic of contract function _getStatus:
 * function _getStatus(uint256 boxId_) internal view returns (Status) {
 *     Status status = _publicData[boxId_]._status;
 *     // If the deadline has passed, then you need to judge the status of the box
 *     if (_publicData[boxId_]._deadline < block.timestamp) {
 *         // 1, Box in selling/auctioning, if there is no buyer, then the status is Published
 *         if (status == Status.Selling || status == Status.Auctioning) {
 *             if (EXCHANGE.buyerOf(boxId_) == address(0)) {
 *                 return Status.Published;
 *             } else {
 *                 // If there is a buyer, then the status is Paid
 *                 return Status.Paid;
 *             }
 *         } else if (status == Status.Delaying) {
 *             // 2, Box in Delaying status, then the status is Published
 *             return Status.Published;
 *         }
 *     }
 *     return status;
 * }
 * 
 * @param status - status on supabase
 * @param deadline - Deadline (Unix timestamp, seconds)
 * @param buyerId - Buyer ID (Optional, used to judge if there is a buyer. null/undefined/empty string means no buyer)
 * @returns Calculated status
 */
export function calculateStatus(
    status: number,
    deadline: number | string | null | undefined,
    buyerId: string | number | null | undefined
): string {
    if (import.meta.env.DEV) {
        console.log('status:', status, 'deadline:', deadline, 'buyerId:', buyerId);
    }

    const statusStr = boxStatusMap_string[status];
    if (deadline === null || deadline === undefined) {
        return statusStr;
    }

    let deadlineSeconds = 0;
    if (typeof deadline === 'number') {
        deadlineSeconds = deadline;
    } else if (typeof deadline === 'string') {
        const parsed = Number(deadline);
        deadlineSeconds = Number.isNaN(parsed) ? 0 : parsed;
    }

    if (deadlineSeconds === 0) {
        return statusStr;
    }

    const now = Math.floor(Date.now() / 1000);

    if (now <= deadlineSeconds) {
        return statusStr;
    }

    if (statusStr === 'Selling' || statusStr === 'Auctioning') {
        const hasBuyer = buyerId !== null && 
                        buyerId !== undefined && 
                        buyerId !== '' && 
                        buyerId !== 0 ;
        
        if (hasBuyer) {
            return 'Paid';
        } else {
            return 'Published';
        }
    }
    
    if (statusStr === 'Delaying') {
        return 'Published';
    }

    return statusStr;
}

export const getListedMode = (mode: number | null): string | null => {
    if (mode === 2) return 'Auctioning';
    if (mode === 1) return 'Selling'; // Assuming 1 is Selling/Direct
    return null;
};
