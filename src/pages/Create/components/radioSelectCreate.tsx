import React from 'react';
import { useTanStackForm } from '../context/TanStackFormContext';
import { Radio } from 'antd';
import TextTitle from '@/components/base/text_title';

const RadioSelectCreate: React.FC = () => {
    const form = useTanStackForm();

    return (
        <form.Field name="mint_method">
            {(field) => (
                <div className="flex flex-col space-y-2">
                    <TextTitle>Mint Method:</TextTitle>
                    <div className="flex flex-row gap-2">
                        <Radio.Group 
                            buttonStyle='solid' 
                            onChange={(e) => field.handleChange(e.target.value as any)} 
                            value={field.state.value}
                        >
                            <Radio.Button value="create">Storing</Radio.Button>
                            <Radio.Button value="createAndPublish">Publish</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
            )}
        </form.Field>
    );
}

export default RadioSelectCreate;
