#Given a dictionary mapping distance away (number) to whether or not there is a rabbit there (boolean), 
#return the number of rabbits the meditator wants
#Example dictionary: {19: False, 23: True} 
# At a location 19 meters away, there isn't a rabbit, At a location 23 meters away, there is a rabbit.

import sys

def rabbitcatch(dictionary):
    count=0
    for key in dictionary:
        if dictionary[key]==True and key<=20:
            count+=1
    return count

if __name__ == "__main__":
    input = sys.argv[1].split(',')
    final_input= {}
    for string in input:
        arr=string.split(':')
        number=int(arr[0])
        boolean=True if arr[1]=="True" else False
        final_input[number]=boolean
    input=final_input
    result = int(sys.argv[2])
    print(result)
    print(rabbitcatch(input))
    print(rabbitcatch(input)==result)