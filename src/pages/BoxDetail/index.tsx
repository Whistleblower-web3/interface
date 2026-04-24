import React from 'react';
import { useParams } from 'react-router-dom';
import ContentLeft from './containers/left';
import ContentRight from './containers/right';
import { Container } from '@/components/Container';
import { BoxDetailProvider } from './contexts/BoxDetailContext';
import { HandcuffsSvg } from '@/components/svgs/HandcuffsSvg';
import Container_BoxDetail from "./containers";

const BoxDetail: React.FC = () => {
    const { tokenId } = useParams<{ tokenId: string }>();

    return (
        <>
            {/* This is a radial gradient to create a top light effect */}
            <div
                className="absolute -top-50 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none -z-100"
                style={{
                    background: 'radial-gradient(circle at top, rgba(219, 144, 253, 0.4) 0%, rgba(198, 169, 252, 0.05) 40%, transparent 80%)'
                }}
            >
            </div>
            <Container className="relative py-8 md:py-12 lg:py-16">

                {/* Hero Section */}
                <div className="text-center mb-8 md:mb-12 flex flex-col items-center justify-center">
                    <HandcuffsSvg
                        strokeWidth={5}
                        color="primary"
                        fillColor="black"
                        isAnimated={true}
                        width={160}
                        height={80}
                    />
                    <p className="
                    italic
                    text-xl md:text-2xl lg:text-3xl font-bold
                    text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-primary
                
                    ">
                        "Truth will be revealed, criminals will be punished!"
                    </p>
                </div>
                <BoxDetailProvider boxId={tokenId || ''}>

                    {/* Main Content */}
                    <Container_BoxDetail />
                </BoxDetailProvider>
            </Container>

        </>
    );
}

export default BoxDetail;
