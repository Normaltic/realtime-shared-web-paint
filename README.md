# Web Paint

17년 2학기 클래스 셀링 프로그램 연계 프로젝트입니다.  
<small>( [클래스 셀링](http://uni.dongseo.ac.kr/lincplus/index.php?pCode=MN2000024) : 기업의 요구사항에 맞춰 개발하며 매주 지도를 받고, 결과물을 기업에게 판매하는 교내 프로그램 )</small>

학부에서 사용중인 스마트 보드(전자 칠판)과 유사한 기능을 가지고, 접속한 사용자들의 입력을 실시간으로 공유하는 HTML5 Canvas 기반의 웹 판서 페이지 입니다.

## 기능
기능적 요구사항을 구현여부에 따라 구분하였습니다.

#### 구현
* 그림 툴
    - 펜 - 깨지고 각지지 않게 입력하는대로 그려져야 한다
    - 지우개 - 입력하는 부분만 정확히 지워져야 한다
    - 도형 - 도형( 사각형, 원 ) 을 그릴 수 있어야 한다
    - 툴 설정 - 그림 툴의 색상, 굵기( 도형은 테두리 )를 변경할 수 있어야 한다
    - 취소하기, 되돌리기 - 마지막 입력을 취소하거나, 취소한 입력을 되돌릴 수 있어야 한다
* 화면
    - 화면 추가 - 새로운 화면을 추가할 수 있어야 한다
    - 화면 전환 - 화면을 전환하며 작업을 할 수 있어야 한다
* 환경
    - 실시간 공유 - 사용자들의 작업이 실시간으로 공유되어야 한다 ( 부분 구현 )

#### 미구현
* 그림 툴
    - 붓 - 입력 속도에 따라 굵기가 변해야 한다
    - 형광펜 - 형광펜 모양으로 그려져야 한다
* 화면
    - 배경 변경 - 배경 사진을 변경할 수 있어야 한다
    - 화면 복사 - 선택한 화면을 복사할 수 있어야 한다
* 파일
    - 저장하기 - 페이지 내 모든 화면의 내용을 PDF로 저장할 수 있어야 한다
    - 불러오기 - PDF, 사진 등을 불러올 수 있어야 한다

## 기술 스택
### Client
* React
* Redux - [ducks](https://velopert.com/3358)구조 사용( + redux-actions )
* webpack
### Server
* node.js
* socket.io

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
