function showState(data){
	var tomorrow = moment().add(1,'days');
	var now = moment();

	var birthday_org = moment(data.baby.birthday);
	var birthday = moment(data.baby.birthday2);

	var diff_day = tomorrow.diff(birthday,'days');
	var diff_day_org = now.diff(birthday_org,'days',true);
	var hour = 24*(diff_day_org - parseInt(diff_day_org));
	var minute = 60*(hour - parseInt(hour));
	var sec = 60*(minute - parseInt(minute));
	var duration = moment.duration(tomorrow.diff(birthday));

	var months = parseInt(duration.years()*12 + duration.months());
	var days = parseInt(duration.days());


	$('#current-state').text('');

	var str = $("<blockquote> 태어난지 <span class='pday'>"+months+"</span>개월 <span class='pday'>"+days+"</span>일 이 지났습니다. (<span class='pday'>"+parseInt(diff_day)+"</span>일)<br>정확히는 <span class='pday'>"+parseInt(diff_day_org)+"</span>일 <span class='phour'>"+parseInt(hour)+"</span>시간 <span class='pminute'>"+parseInt(minute)+"</span>분 <span class='psecond'>"+parseInt(sec)+"</span>초 지났습니다.</blockquote>");

	$('#current-state').append(str);

	setTimeout(function(){
		showState(data);
	}, 1000);
}

function showEvents(data){
	for(var i in data.events){
		var t_event = data.events[i];

		var event_value = t_event.value;
		var now = moment();

		if(t_event.type == 'd'){
			event_value += 1;
			//now = moment().add(1,'days');
		}

		var event_day = moment(data.baby.birthday2).add(t_event.value,t_event.type);

		var diff_day = event_day.diff(now,'days',true);
		if(diff_day < 0) continue;

		var row = $("<tr>");
		var title = $("<td class='event-title'>"+t_event.name+"</td>");
		var date = $("<td class='event-date'>"+event_day.format('YYYY-MM-DD')+"</td>");
		var diff = $("<td class='event-diff'>"+parseInt(diff_day+1)+"</td>");

		$("#event-state-body").append( row.append(title,date,diff) );
	}
}
