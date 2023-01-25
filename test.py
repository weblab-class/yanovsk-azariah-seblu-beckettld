import sys
# A Pangram is a sentence where every letter of the English alphabet 
# appears at least once. Given a string s containing lowercase English letters
# write a function that returns true if s is a pantagram, or false otherwise

# Example: s = "thequickbrownfoxjumpsoverthelazydog" Output: true
# Example 2: s = "weblab" Output: false

# Constraints: 1 <= s.length <= 1000


def checkIfPangram(s):
        letters = set()
        for char in s:
            if char not in letters:
                letters.add(char)
        return len(letters) >= 26


#DO NOT EDIT CODE BELOW
if __name__ == "__main__":
  s_input = sys.argv[1]
  result =sys.argv[2]
  print(str(checkIfPangram(s_input))==result)