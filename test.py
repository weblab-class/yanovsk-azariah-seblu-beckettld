import sys

#You are given an array of strings that either say “clean” or “dirty.”
# return an array of the indices of only his clean guns

def gun_clean(arr):
    final_arr=[]
    for i in range(len(arr)):
      if arr[i]=="clean":
        final_arr.append(i)
    return final_arr
if __name__ == "__main__":
    a = sys.argv[1].split(',')
    b = sys.argv[2].split(',')
    b = [int(x) for x in b]    
    print(b)
    print(sorted(gun_clean(a)))
    print(sorted(gun_clean(a))==sorted(b))