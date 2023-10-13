import {Button, Form, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

export const FilterForm = ({onFormFinish}: {onFormFinish: (data: {name: string}) => void}) => <>
    <div style={{padding: '0px 0px 10px 0px'}}>
        <Form onFinish={onFormFinish} layout={'inline'}>
            <Form.Item label={'Jméno hráče (bez diakritiky):'} name={'name'}>
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit"></Button>
            </Form.Item>
        </Form>
    </div>
</>