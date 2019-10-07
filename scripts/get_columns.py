'''
This script fetch columns from uploaded dataset
'''

import sys
from datatype import DataFrame

DATAFRAME = DataFrame.get_dataframe_from_csv(sys.argv[1])

print(DATAFRAME.get_columns())
