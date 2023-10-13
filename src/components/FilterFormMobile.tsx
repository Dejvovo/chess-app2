import {Button, Form, Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";

export const FilterFormMobile = ({onFormFinish}: {onFormFinish: (data: {name: string}) => void}) => <>
    <div>
        <Form onFinish={onFormFinish} style={{display: 'flex', justifyContent: 'center', padding: '4px 4px 12px 4px', marginBottom:'12px', borderBottom: '1px solid gray'}}>
            <label style={{marginTop: '4px', height: "min-content"}}>Jméno hráče (bez diakritiky):</label>
            <div style={{display: 'flex', gap: '10px', height: "32px"}}>
                <Form.Item name={'name'} style={{width: '200px'}}><Input name={'name'} style={{width: '200px', height: 'min-content', margin: '0 8px'}}/></Form.Item>
                <Button type="primary" icon={<SearchOutlined />} htmlType="submit"></Button>
                </div>
        </Form>
    </div>
</>