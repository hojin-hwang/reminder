우라의 알람서비스는 고객에게 놀랍고도 긍정적인 라이프 스타일을 경험할 수 있도록 한다.

고객의 생활 패턴, 프로필을 바탕으로 최적의 습관 정보를 제시한다.

기획, 클라이언트 : 12 * 500 = 0.6
앱 : 6 * 200 = 0.12
디자인 : 6 * 100 = 0.06
기획 : 6 * 50 = 0.03
서버 : 12 * 50 = 0.06
사무실 : 12 * 150 = 0.18
운영비 : 0.15
계 : 1.2
-----------------------------------------------------

localStorage
key
card : todo-info list  (live, trash)
panel : todo scheduled list
history : already done todo scheduled list

make card and save loacalStorage -> postMessage
make remind-panel by postMessage at checkBox component.

https://getbootstrap.com/docs/5.3/components/card/
https://preview.colorlib.com/theme/bootstrap/calendar-14/

time : https://nhn.github.io/tui.time-picker/latest/tutorial-example03-using-step

toasts를 이용하여 checked Panel(waiting Data)를 처리하자.
하나의 카드에 하나의 scheduedData 를 보여주자.

cardMap [ key:id, value:info ]

checkingMap [key:id, value:{cardId, checkingDate, scheduledDate}]

scheduledMetaData = { cardId :{ lastScheduleDate, interval, index,  checktime} }

scheduledList[ {id, cardId, checkingDate, scheduledDate}]

카드 정보에 따라서 스케줄을 하나하나 만들어 주는 함수가 필요(카드인포에 인터벌 정보필요, case, value)

