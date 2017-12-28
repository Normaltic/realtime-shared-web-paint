# Smart Board

클래스셀링 주제인 실시간 공유 SmartBoard 웹 개발 <br />
front : React.js, Redux <br />
back : socket-io, babel <br />

# Version

## 1.4
Pencil 툴의 곡선이 각이 지는 현상 제거 ( Pencil.js => Pencil.mi.js ) <br />
Eraser 가 사각형 모양으로 끊기며 지워지는 현상 제거 ( Eraser.js => Eraser.line.js ) <br />
Redo, Undo 후 다시 그릴때의 순서가 바뀌던 오류 수정 <br />
소켓 이벤트 핸들링 최적화 진행 <br />

## 1.3 ( Branch : 1.2.1 - Commit Miss )
Store 구조 변경 <br />
Undo, Redo 툴 추가 <br />

## 1.2
Pen 실시간 공유 딜레이 감소 <br />
각 툴 상세 옵션 구현, 기초 아이콘 적용 ( 굵기, 색상 ) <br />
getElementById -> findDOMNode 사용 <br />
Images Directory 수정 <br />


## 1.1
다중페이지, 페이지별 preview 개발 <br />
디자인 초안 적용 <br />

## 1.0
webpack, server등 기초 환경 세팅 <br />
socket을 통한 픽셀단위 공유 ( 개선 필요 ) <br />
Canvas 기능 구현 ( Pen, Eraser, Rect, Circle ) <br />
