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
            if(!this.cno || !this.name || !this.dept){
                alert('信息不能为空')
                return 
            }
            let request = new XMLHttpRequest()
            request.onreadystatechange = ()=>{
                if(request.readyState == 4)
                {
                    if(request.responseText == 'Update Completed')
                    {
                        this.cno = ''
                        this.name = ''
                        this.dept = ''
                    }
                    alert(request.responseText)
                }
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
            if(!this.dcno){
                alert('信息不能为空')
                return
            }
            let request = new XMLHttpRequest()
            request.onreadystatechange = ()=>{
                if(request.readyState == 4)
                {
                    if(request.responseText == 'Update Completed')
                        this.dcno = ''
                    alert(request.responseText)
                }
            }

            request.open('POST', '/card/delete', true)
            request.send(JSON.stringify({
                cno : this.dcno
            }))
        }
    }
})