import { Button, Input, Upload, type UploadProps } from "antd";
import { useState } from "react";

const ParserTest = ()=>  {
    const [value, setValue] = useState();

    return <>
        Vložte url pgn <Input value={value} />    <Button>Naparsuj</Button>
    </>
}


export default ParserTest;
