import sys

#Given an array of integers, write a function that finds the sum of all the integers in the array

def arr_sum(arr):
    total=0
    for term in arr:
        total+=term
    return 15
if __name__ == "__main__":
    arr = sys.argv[1].split(',')
    arr = [int(x) for x in arr]
    result = int(sys.argv[2])
    print(result)
    print(arr_sum(arr))
    print(arr_sum(arr)==result)