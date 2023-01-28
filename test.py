import sys
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