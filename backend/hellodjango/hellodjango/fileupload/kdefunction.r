KDE_function <-function (windowLayer, pointLayer, bandwidth, outputfolder, shpfilename) {

  # load maptools library
  library(maptools)
  library(spatstat)
  library(rgdal)
  library(rasterVis)

  # Hack to ignore overlapping polygons,
  # without this function will not run.
  spatstat.options(checkpolygons=FALSE)

  # load window layer function
  loadOwin <- function(filename){
    x <- readShapePoly(filename)
    return(as.owin(x))
  }

  # load point pattern window layer function
  loadPoints <- function(filename, owin){
    x <- readShapePoints(filename)
    x <- as(x, "ppp")
    x <- unmark(x)
    x <- x[owin]

    return(x)
  }

  raster2ContourSHP<- function(rasterPath, layerName, outputFolder) {
    library(rgdal)
    library(maptools)
    setwd(outputFolder)
    dem <- readGDAL(rasterPath)
    im <- as.image.SpatialGridDataFrame(dem)
    cl <- contourLines(im , nlevels=20)
    SLDF <- ContourLines2SLDF(cl,proj4string=CRS(as.character("+proj=longlat +ellps=WGS84 +datum=WGS84")))
    writeOGR(SLDF, ".", layerName, driver="ESRI Shapefile")

    # Remove comments if you want it to be plotted on R
    # mc <- readOGR(".", layerName)
    # summary(dem)
    # summary(mc)
    # image(dem, col=gray.colors(20))
    # plot(mc, col=terrain.colors(8), add=TRUE)
  }

  # let y be window layer
  # let x be point layer
  y <- loadOwin(windowLayer)
  x <- loadPoints(pointLayer, y )

  #Convert the generic sp format into spatstat's pp format
  nm_ppp <- as(x, "ppp")

  #Compute KDE
  kde_nm_bandwidth <- density(nm_ppp,bandwidth)

  #matrix conversion
  matrix<-as.matrix.im(kde_nm_bandwidth)

  #bind col and rows
  v <- (cbind(kde_nm_bandwidth$yrow,kde_nm_bandwidth$xcol))

  #convert the kde out to grid object
  gridded_kde <- as.SpatialGridDataFrame.im(kde_nm_bandwidth)

  #create tempfile path
  tempFilePath <- paste(outputfolder, shpfilename, "_temp.GTiff", sep = "")

  #write the kde raster into ESRI grid format
  r <- writeGDAL(gridded_kde, drivername = "GTiff", copy_drivername = "GTiff", tempFilePath)

  #call raster2Contour
  raster2ContourSHP(tempFilePath, shpfilename, outputfolder)

}
