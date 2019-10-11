'''
This script fetch types from uploaded header
'''

import sys
from datatype import Header

HEADER = Header.get_header_from_txt(sys.argv[1])

print(HEADER.get_lines_json())
