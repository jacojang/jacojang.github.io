---
layout: post
title: JPA - 5장 - 연관관계 매핑 기초
categories: [jpa, java, hibernate]
comments: true
image:
---
> ※ 이 문서는 개인적인 필요에 의해 [JPA 프로그래밍](http://www.acornpub.co.kr/book/jpa-programmig) 책을 요약/추가 한 내용입니다.

### 단방향 연관관계
연관관계중에서는 다대일(N:1)을 가정 먼저 이해 하고 넘어가야 한다. 회원과 팀의 관계가 그에 해당 한다.

> 회원과 팀이 있다.
> 회원은 하나의 팀에만 속할 수 있다.

{% highlight java %}
---------           0..1  ----------
Member    --------------> Team
---------                 ----------
id                        id
Team team                 name
username
---------                 ----------
{% endhighlight %}

##### 객체 연관관계
Member 객체는 Member.team 필드로 팀객체와 연관 관계를 맺고 있고 이는 단방향 관계이다.
즉 Member는 team 필드로 팀을 알수 있지만 Team은 Member를 알아 낼 수 없다.

##### 테이블 연관관계
반면 테이블은 외래 키를 이용해서 양방향으로 조회 할 수 있다. 즉, 외래키를 이용해서 서로 JOIN해주면 양방향의 관계를 알아 낼 수 있다.


#### 순수한 객체 연관관계



<!--more-->
