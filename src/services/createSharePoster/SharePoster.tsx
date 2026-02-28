import React from "react";
import StatusLabel from "@/components/base/statusLabel";
import PriceTimer from "@/pages/BoxDetail/components/priceTimer";
import { BoxStatus } from "@dapp/types/typesDapp/contracts/truthBox";
import { QRCodeSVG } from "qrcode.react";
import { BoxUnifiedType } from "@/services/supabase/types/types";
import { MetadataBoxType } from "@/types/typesDapp/metadata/metadataBox";
import { useIpfsImage } from "@/hooks/useIpfsImage";
import Logo from "@/components/base/logo";

interface SharePosterProps {
    box: BoxUnifiedType;
    metadataBox: MetadataBoxType;
    url: string;
    isMobileLayout: boolean;
}

const SharePoster: React.FC<SharePosterProps> = ({
    box,
    metadataBox,
    url,
    isMobileLayout,
}) => {
    const { displayUrl } = useIpfsImage(metadataBox?.box_image || "", true);

    if (!box || !metadataBox) return null;

    const status = box.status as BoxStatus;
    const price = box.price ?? "";
    const token = box.accepted_token ?? "";
    const deadline = Number(box.deadline);

    // Default black/dark background with Wiki Truth theme
    if (isMobileLayout) {
        return (
            <div
                id="share-poster-capture-mobile"
                className="flex flex-col bg-background text-foreground shrink-0"
                style={{ width: "640px", height: "1280px", backgroundColor: "#0a0a0a" }}
            >

                <div className="flex-1 p-4 flex flex-col gap-5">
                    {/* Top Half: Content */}
                    <div className="
                        flex justify-between items-start 
                        border-b border-border/50
                        py-2
                    ">
                        <div className="flex flex-col gap-2">
                            <Logo />
                            <span className="text-sm text-muted-foreground">
                                Decentralized Evidence & Asset Protocol
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <div className="flex flex-col gap-2">
                                    <span className="text-lg font-bold">Scan to view:</span>
                                </div> */}
                            <div className="bg-white p-1 rounded-md shrink-0">
                                <QRCodeSVG
                                    value={url}
                                    size={60}
                                    level="M"
                                    includeMargin={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="h-[500px] w-auto shrink-0 relative border-t border-border/50">
                        {/* Use a standard img tag with crossOrigin enabled for html2canvas */}
                        <img
                            src={displayUrl}
                            alt={metadataBox.title}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-lg font-black leading-tightline-clamp-3">
                            {metadataBox.title}
                        </h1>

                        <div className="flex gap-4 text-xl text-muted-foreground">
                            <div className="bg-muted/30 px-4 py-1 rounded-lg">
                                <span className="font-semibold text-foreground">Box ID:</span>{" "}
                                {box.id}
                            </div>
                            <div className="bg-muted/30 px-4 py-1 rounded-lg">
                                <span className="font-semibold text-foreground">Minter ID:</span>{" "}
                                {box.minter_id}
                            </div>
                            <div className="h-4 w-px bg-border/40 mx-1"></div>
                            <StatusLabel status={status} size="lg" />
                        </div>

                        {/* Price & Timer using existing component */}
                        <div className="origin-top-left">
                            <PriceTimer
                                status={status}
                                price={price}
                                token={token}
                                deadline={deadline}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // PC Layout (1280x720)
    return (
        <div
            id="share-poster-capture-pc"
            className="flex flex-col bg-background text-foreground shrink-0"
            style={{ width: "1280px", height: "720px", backgroundColor: "#0a0a0a" }}
        >
            {/* Top: Logo & QR Code Section */}
            <div className="px-10 py-4 border-b border-border/50 flex justify-between items-center bg-background/80">
                <div className="flex flex-col gap-2">
                    <Logo />
                    <span className="text-md text-muted-foreground opacity-80">
                        Decentralized Evidence & Asset Protocol
                    </span>
                </div>
                {/* Moved QR Code to Top Right */}
                <div className="flex flex-col items-center gap-2">
                    {/* <div className="flex flex-col items-end gap-1 px-1">
                        <span className="text-[10px] text-foreground font-bold leading-none">Scan to view:</span>
                    </div> */}

                    <div className="bg-white p-1 rounded-md shadow-lg">
                        <QRCodeSVG
                            value={url}
                            size={64}
                            level="M"
                            includeMargin={false}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom: Split Region */}
            <div className="flex-1 flex flex-row overflow-hidden">
                {/* Left Half: Image */}
                <div className="w-[640px] h-full shrink-0 relative border-r border-border/50">
                    <img
                        src={displayUrl}
                        alt={metadataBox.title}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Half: Content */}
                <div className="flex-1 p-8 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-6">
                        <h1 className="text-xl font-black leading-snug line-clamp-3">
                            {metadataBox.title}
                        </h1>

                        {/* StatusLabel moved here, same div with BoxID/MinterID */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-muted/30 px-3 py-1 rounded-lg border border-border/20 text-sm">
                                <span className="font-semibold text-muted-foreground">Box ID:</span> {box.id}
                            </div>
                            <div className="bg-muted/30 px-3 py-1 rounded-lg border border-border/20 text-sm">
                                <span className="font-semibold text-muted-foreground">Minter ID:</span> {box.minter_id}
                            </div>
                            <div className="h-4 w-px bg-border/40 mx-1"></div>

                            <StatusLabel status={status} size="sm" />

                        </div>

                        <div className="scale-100 origin-top-left pt-4">
                            <PriceTimer
                                status={status}
                                price={price}
                                token={token}
                                deadline={deadline}
                            />
                        </div>
                    </div>

                    <div className="mt-auto opacity-40 text-[12px] font-mono tracking-widest uppercase">
                        Authentic Data verified by Wiki Truth Protocol
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharePoster;
