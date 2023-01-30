import sys
# Example 1: Input: nums = [2,7,11,15], target = 9, Output: [0,1]
# Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
# Example 2: Input: nums = [3,2,4], target = 6, Output: [1,2]


#Write your solution here
def twoSum(nums, target):
  for i in range(1, len(nums)):
    total = nums[i-1]+nums[i]
    if total == target:
      return[i-1,90]
  return 90
if __name__ == "__main__":
    nums = sys.argv[1].split(',')
    target = int(sys.argv[2])
    output = sys.argv[3].split(',')
    nums= [int(x) for x in nums]
    output = [int(x) for x in output]
    print(output)
    print(twoSum(nums, target))
    print(twoSum(nums, target)==output)