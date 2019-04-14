new Vue({
    el: "#addition",
    data:{
        cno: '',
        name: '',
        dept:'',
        type: 'student'
    },
    methods:{
        add(){
            let request = new XMLHttpRequest()
            request.onreadystatechange = ()=>{
                if(request.readyState == 4)
                    alert(request.responseText)
            }

            request.open('POST', '/card/add', true)
            console.log({
                cno : this.cno,
                name : this.name,
                type : this.type,
                dept : this.dept
            })
            request.send(JSON.stringify({
                cno : this.cno,
                name : this.name,
                type : this.type,
                dept : this.dept
            }))
        }
    }
})

new Vue({
    el: '#del',
    data:{
        dcno : ''
    },
    methods:{
        del(){
            let request = new XMLHttpRequest()
            request.onreadystatechange = ()=>{
                if(request.readyState == 4)
                    alert(request.responseText)
            }

            request.open('POST', '/card/delete', true)
            request.send(JSON.stringify({
                cno : this.dcno
            }))
        }
    }
})