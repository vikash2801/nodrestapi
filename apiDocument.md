#Page1
>List of courses (GET)
http://localhost:9000/courseDetail

>list of courses wrt course type (GET)
http://localhost:9000/courseDetail/courseType/{{courseType}}
e.g
    courseType = Java, python, etc..

>list of courses wrt rating
http://localhost:9000/courseDetail/rating/{{rating}}
e.g
    rating = 4, 3.5, etc..

#Page2
>list course wrt courseCategory
http://localhost:9000/filter/{{courseCategory}}
e.g
    courseCategory = Development, Marketing, etc..

>filter course wrt courseType
http://localhost:9000/filter/{{courseCategory}}?courseType=Java

>filter course wrt cost
http://localhost:9000/filter/{{courseCategory}}?lcost=700&hcost=1500

>filter course wrt language
http://localhost:9000/filter/{{courseCategory}}?lang=English

>sort the course from high cost to low cost(descending)
http://localhost:9000/filter/{{courseCategory}}?lcost=700&hcost=1500&sort=-1

#Page3
>placeOrder call (POST)
http://localhost:9000/placeOrder
//Body
{
    "name":"Mehak",
    "email":"mhanda124@gmail.com",
    "address":"Bno 23,Sector 4,East Delhi",
    "phone":968760086,
    "courseItem":[1,5],
    "status": "Pending"
}

#Page4
>List of Orders (GET)
http://localhost:9000/orders

>list of orders wrt email (GET)
http://localhost:9000/orders?email=mhanda124@gmail.com


