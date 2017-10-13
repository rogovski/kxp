import numpy as n
import matplotlib.pyplot as plt

# Random gaussian data.
Ntotal = 1000
data = 0.05 * n.random.randn(Ntotal) + 0.5

# This is  the colormap I'd like to use.
# original: RdYlBu_r
cm = plt.cm.get_cmap('jet')

n, bins = np.histogram(data, 12, normed=1)
bin_centers = 0.5 * (bins[:-1] + bins[1:])

# scale values to interval [0,1]
col = bin_centers - min(bin_centers)
col /= max(col)

accum = []
for c in col:
    print(cm(c))
    accum.append(cm(c))
"""
# Plot histogram.
n, bins, patches = plt.hist(data, 12, normed=1, color='green')
bin_centers = 0.5 * (bins[:-1] + bins[1:])

# scale values to interval [0,1]
col = bin_centers - min(bin_centers)
col /= max(col)

accum = []
for c, p in zip(col, patches):
    print(cm(c))
    accum.append(cm(c))
    plt.setp(p, 'facecolor', cm(c))
"""

color_row = np.array(map(lambda x: x[0:3], accum)).reshape((1,12,3))
color_table = np.array(map(lambda x: x[0:3], accum)).astype(np.float32)
scene = np.zeros((256,256,3)).astype(np.float32)
# make bg
scene[:,:] = color_table[0,:] 
# make facade
scene[15:30,0:-1] = color_table[1,:] 
scene[30:45,0:-1] = color_table[2,:] 
scene[45:60,0:-1] = color_table[3,:] 
scene[60:75,0:-1] = color_table[4,:] 
scene[75:90,0:-1] = color_table[5,:] 
scene[90:105,0:-1] = color_table[6,:] 
scene[105:120,0:-1] = color_table[7,:] 
scene[120:135,0:-1] = color_table[8,:] 
scene[135:150,0:-1] = color_table[9,:] 
scene[150:165,0:-1] = color_table[10,:] 
scene[165:180,0:-1] = color_table[11,:] 

# bg[:,:] = color_table[0,:]
# plt.show()

"""
0. Background
1. Facade
2. Molding
3. Cornice
4. Pillar
5. Window
6. Door
7. Sill
8. Blind
9. Balcony
10. Shop
11. Deco
"""


