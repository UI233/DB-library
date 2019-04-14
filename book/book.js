let main_window = new Vue({
    el : "#search",
    data :{
        books : [],
        show : true
    },
    methods : {
        lookup(){
            this.show = true
            let request = new XMLHttpRequest()
            request.onreadystatechange = () => { 
                if(request.readyState == 4)
                {
                    let data = JSON.parse(request.responseText)
                    this.books = data.returnData 
                }
            }

            let cat = document.getElementById("category").value
            let yl = document.getElementById("year_low").value
            let yr = document.getElementById("year_high").value
            let pre = document.getElementById("press").value
            let tit = document.getElementById("title").value
            let pl = document.getElementById("price_low").value
            let pr = document.getElementById("price_high").value
            let ord = document.getElementById("order").value
            let desc = document.getElementById('orderofresult').value

            let condition = {
                category : cat,
                press : pre,
                title : tit,
                price_low : pl,
                price_high : pr,
                year_low : yl,
                year_high :yr,
                order : ord ? ord : "title",
                desc : desc
            }
            console.log(condition)
            request.open("POST", "/book/lookup",true)
            request.send(JSON.stringify(condition))
        }
    }
})