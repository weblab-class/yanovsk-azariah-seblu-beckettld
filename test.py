import sys
import errno
import os
import signal
import functools

class TimeoutError(Exception):
    pass

def timeout(seconds=10, error_message=os.strerror(errno.ETIME)):
    def decorator(func):
        def _handle_timeout(signum, frame):
            raise TimeoutError(error_message)

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            signal.signal(signal.SIGALRM, _handle_timeout)
            signal.alarm(seconds)
            try:
                result = func(*args, **kwargs)
            finally:
                signal.alarm(0)
            return result

        return wrapper

    return decorator

@timeout(2, os.strerror(errno.ETIMEDOUT))# Given a normal name (string), return it to the farmer in the way 
# he wants it

def name_horse(name):
    return 20
if __name__ == "__main__":
    a = sys.argv[1]
    b = sys.argv[2]
    print(b)
    print(name_horse(a))
    print(name_horse(a)==b)