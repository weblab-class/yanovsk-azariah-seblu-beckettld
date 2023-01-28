import sys
<<<<<<< HEAD
# Given an integer array arr, count how many elements x there are, such that x + 1 
# is also in arr. If there are duplicates in arr, count them separately.

# Example Input: arr = [1,2,3] Output: 2
# 1+1 = 2, 2+1=3 , so there are 2 elements that meet the x+1 condition

# Example Input 2: arr = [1,1,3,3,5,5] Output: 0 
# No element meets x + 1 condition 

# Constraints: 1 <= arr.length <= 1000

def countElems(arr):
        sets = set(arr)
        cnt =0
        for i in arr:
            if i+1 in sets:
                cnt +=1
                
        return cnt
def checkIfPangram(s):
        letters = set()
        for char in s:
            if char not in letters:
                letters.add(char)
        return len(letters) >= 26
if __name__ == "__main__":
  s_input = sys.argv[1]
  result =sys.argv[2]
  print(result)
  print(str(checkIfPangram(s_input)))
  print(str(checkIfPangram(s_input))==result)
=======

#Given an array of integers, write a function that finds the sum of all the integers in the array

def arr_sum(arr):
    total=0
    for term in arr:
        total+=term
    return total
if __name__ == "__main__":
    arr = sys.argv[1].split(',')
    arr = [int(x) for x in arr]
    result = int(sys.argv[2])
    print(result)
    print(arr_sum(arr))
    print(arr_sum(arr)==result)
>>>>>>> collisions_smoother
