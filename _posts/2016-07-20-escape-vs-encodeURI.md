---
layout: post
title: escape() vs encodeURI() vs encodeURIComponent()
categories: []
comments: true
image:
---

보통 javascript에서 URI를encoding하는 방법에는 3가지가 존재 한다. encoding이란 통신상에서 잘못된 정보를 주고 받지 않도록 하기 위해 한글과 같은 2바이트 문자열이나 특수문자등을 ASCII형태의 문자로 변환하는 것을 말한다.   



##### 1. escape()
아래의 문자열을 제외한 모든 문자는 %XX나 %uXXXX 형태의 16진수를 문자열로 나타넨 형식으로 변환된다.

```
ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890 @*-_+./  
```

##### 2. encodeURI()
함수 이름에서도 알 수 있듯이 URI 전체를 encoding 할때 사용되는 함수 이다. URI에 사용되는 특수 문자(: ; / = ? &)를 encoding 하지 않는 다는 것만 빼고 escape()와 동일하다.

##### 3. encodeURIComponent()
함수 이름에서도 할 수 있듯이 URI 전체가 아닌 부분부분을 encoding할때 사용하는 함수 이다. URI에 사용되는 특수 문자(: ; / = ? &)까지 encoding 된다는 것만 빼고 escape()와 동일하다.

URI에 사용되는 특수 문자가 encoding 되므로 URI 전체를 encoding 하는 경우 URI가 아닌 하나의 문자열로 인식 되게 되므로 주의 해야 한다. URI의 Parameter의 Value값을 encoding할때 주로 사용되게 된다.
<!--more-->

**예제**
{% highlight javascript %}
var str="http://test.com/user.jsp?name=홍 길동&phone=010-123-1234";

console.log("escape()            ="+escape(str));
console.log("encodeURI()         ="+encodeURI(str));
console.log("encodeURIComponent()="+encodeURIComponent(str));

{% raw %}
---- 결과 ----
escape()            =http%3A//test.com/user.jsp%3Fname%3D%uD64D%20%uAE38%uB3D9%26phone%3D010-123-1234
encodeURI()         =http://test.com/user.jsp?name=%ED%99%8D%20%EA%B8%B8%EB%8F%99&phone=010-123-1234
encodeURIComponent()=http%3A%2F%2Ftest.com%2Fuser.jsp%3Fname%3D%ED%99%8D%20%EA%B8%B8%EB%8F%99%26phone%3D010-123-1234
{% endraw %}
{% endhighlight javascript %}
