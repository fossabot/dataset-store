'''
This script rewrite header with updated column
'''
import sys
from datatype import Header

HEADER = Header.get_header_from_txt(sys.argv[1])
LINES = HEADER.update_line(int(sys.argv[2]), sys.argv[3])

with open(sys.argv[1], 'w') as f:
    for line in LINES:
        f.write(line + '\n')

print(LINES[0])
