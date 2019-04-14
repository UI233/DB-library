import sys

def stringify(hhh : str) -> str:
    return "'" + hhh + "',"

if  __name__ == "__main__":
    if len(sys.argv) >= 2:
        print(sys.argv)
        buffer = ''
        with open(sys.argv[1],'r', encoding='utf-8') as file:
            for line in file:
                temp = line.split(',')
                temp = [x.strip() for x in temp]
                buffer += 'insert into book values('
                for i in range(0, 8):
                    if i == 4 or i == 6 or i == 7:
                        buffer +=  temp[i] + ','
                    else:
                        buffer += stringify(temp[i])
                buffer += '0);\n'
        
        with open('testdata.sql', 'w', encoding = 'utf-8') as file:
            file.write(buffer)
    else:
        print('请输入文件名')