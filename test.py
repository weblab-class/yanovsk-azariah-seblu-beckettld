import sys

#Given an array of milk weights (numbers) return whether the milker 
#has broken the world record (boolean) 

def milk_record(arr):
<<<<<<< HEAD
    return sum(arr)>43.8
=======
    return total
>>>>>>> c027b8806eeefda8f58c131e82392f8905fd019e
if __name__ == "__main__":
    arr = sys.argv[1].split(',')
    arr = [int(x) for x in arr]
    result = sys.argv[2]
    print(result)
    print(milk_record(arr))
    print(str(milk_record(arr))==result)