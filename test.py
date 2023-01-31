import sys
#Input: nums = [3,0,1], Output: 2
#Explanation: n = 3 since there are 3 numbers, so all numbers are in the range [0,3].
# 2 is the missing number in the range since it does not appear in nums.

#Write your solution here
def missingNumber(nums):
    sets = set(nums)
    for i in range(len(sets)+1):
        if i not in sets:
            return i

  


if __name__ == "__main__":
    nums = sys.argv[1].split(',')
    output = int(sys.argv[2])
    nums= [int(x) for x in nums]
    print(output)
    print(missingNumber(nums))
    print(missingNumber(nums)==output)