import sys
# Given an integer array nums sorted in non-decreasing order, 
# return an array of the squares of each number sorted in non-decreasing order.
# Example 1: Input: nums = [4,1,0,3,10] | Output: [0,1,9,16,100]
# Example 2: Input: nums = [7,3,2,3,11] | Output: [4,9,9,49,121]

def sortedSquares(nums):
    n = len(nums)
    helper_arr=[0]*n
    left =0
    right = n-1

    for i in range(n-1, -1,-1):
        if abs(nums[left]) < abs(nums[right]):
            helper_arr[i] = nums[right]**2
            right -= 1
        else:
            helper_arr[i] = nums[left]**2
            left +=1
    return helper_arr
if __name__ == "__main__":
    input = sys.argv[1].split(',')
    input = [int(x) for x in input]
    result = sys.argv[2].split(',')
    result = [int(x) for x in result]
    print(result)
    print(sortedSquares(input))
    print(sortedSquares(input)==result)

