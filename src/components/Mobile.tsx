import {FilterFormMobile} from "~/components/FilterFormMobile";
import {CalendarOutlined} from "@ant-design/icons";
import {blue} from "@ant-design/colors";
import { ChessBaseIframe } from "./ChessBaseIframe";
import { useState } from "react";

interface IGame {
    id: number;
    date: Date|null;
    result: string|null;
    white: string;
    black: string;
    whiteElo: number|null;
    blackElo: number|null;
    pgn: string|null;
    site: string|null;
    event: string|null;
}

interface IProps {
    onFormFinish: (data: {name: string}) => void;
    data: IGame[];
}

const Game = ({game}: {game: IGame}) => {
    const [activeGame, setActiveGame] = useState<string | undefined | null>(undefined);
    console.log(activeGame);
    return (
        <div style={{padding: '9px', borderRadius: '8px', backgroundColor: '#EFEFEF', borderBottom: `3px solid ${blue[5] ?? 'blue'}`, margin: '10px 0'}}>
            <div style={{display: "grid", gridTemplateColumns: '3fr 2fr 3fr', height: 'min-content' , justifyContent: "space-between"}}>
                <div><div style={{fontWeight: 'bold'}}>{game.white}</div><div>{game.whiteElo}</div></div>
                <div style={{textAlign: 'center', backgroundColor: blue[1], margin: 'auto 4px', borderRadius: '5px', padding: '8px 4px'}}>{game.result}</div>
                <div style={{textAlign: 'right'}}><div style={{fontWeight: 'bold'}}>{game.black}</div><div>{game.blackElo}</div></div>
            </div>
            <div style={{display: "flex", justifyContent: 'space-between', padding: '10px 0 0 0'}}>
                <div style={{marginTop: 'auto', paddingBottom: '2px'}}>
                    <div style={{fontSize: 'small'}}><CalendarOutlined/> {game.date?.toLocaleDateString()}</div>
                    <div style={{fontSize: 'x-small'}}> {game.event}</div>
                </div>
                
                <button style={{padding: '6px 10px', borderRadius: '8px', backgroundColor: 'white', border: '0px'}} onClick={() => setActiveGame(activeGame ? undefined : game.pgn)}>{activeGame ? 'Zavřít' : 'Přehrát'}</button>
            </div>
            {activeGame && <ChessBaseIframe activeGame={activeGame}></ChessBaseIframe>}
        </div>
)
}


export const Mobile = ({onFormFinish, data}: IProps) => {
  return (
      <div >
          <FilterFormMobile onFormFinish={onFormFinish}/>
          <div style={{marginBottom: '60px'}}>
          {data?.map((record) => {
              return <div key={record.id}><Game game={record}/></div>
          })}
          </div>
      </div>
  )
}