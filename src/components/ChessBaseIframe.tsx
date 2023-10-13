export const ChessBaseIframe = ({activeGame} : {activeGame: string}) => <iframe title={"ad"}
style={{ width: '100%', height: '100%', minHeight: '750px' }}
srcDoc={gameIframe(activeGame)}></iframe> 

const gameIframe = (pgn?: string ) => `<html><head>   <link rel="stylesheet" type="text/css" href="https://pgn.chessbase.com/CBReplay.css" />
<script src="https://pgn.chessbase.com/jquery-3.0.0.min.js"></script>
<script src="https://pgn.chessbase.com/cbreplay.js" type="text/javascript"></script>
</head><body><div class="cbreplay">${pgn || ''}</div></body></html>`;
