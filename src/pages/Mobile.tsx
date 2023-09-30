import {FilterFormMobile} from "~/pages/components/FilterFormMobile";
import {CalendarOutlined} from "@ant-design/icons";

interface IGame {
    id: number;
    date: Date;
    result: string;
    white: string;
    black: string;
    whiteElo: number;
    blackElo: number;
    pgn: string;
}

interface IProps {
    onFormFinish: (data: {name: string}) => void;
    data: IGame[];
}

const Game = ({game}: {game: IGame}) => {
    return (
        <div style={{padding: '9px', borderRadius: '8px', backgroundColor: '#EFEFEF', borderTop: '3px solid #99BBFF', margin: '10px 0'}}>
            <div style={{display: "grid", gridTemplateColumns: '3fr 2fr 3fr', height: 'min-content' , justifyContent: "space-between"}}>
                <div style={{fontWeight: 'bold'}}>{game.white}</div>
                <div style={{textAlign: 'center', backgroundColor: '#CCE4FF', margin: 'auto 4px', borderRadius: '5px', padding: '8px 4px'}}>{game.result}</div>
                <div style={{textAlign: 'right', fontWeight: 'bold'}}>{game.black}</div>
            </div>
            <div style={{display: "flex", justifyContent: 'space-between', padding: '10px 0 0 0'}}>
                <div style={{marginTop: 'auto', paddingBottom: '2px'}}><CalendarOutlined/> {game.date.toLocaleDateString()}</div>
                <button style={{padding: '6px 10px', borderRadius: '8px', backgroundColor: 'white', border: '0px'}}>Přehrát</button>
            </div>
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