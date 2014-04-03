gwr_function <- function (inputFilePath, gwrFormula, gwrDirectoryPath, outputFilename) {

  library(maptools)
  library(spdep)
  library(spgwr)
  library(classInt)
  library(RColorBrewer)
  library(rgdal)

  # Read in spatial shapefile
  inputFile <- readShapeSpatial(inputFilePath, CRS("+proj=longlat +datum=WGS84"))

  # Calculate the optimal bandwidth
  bw <- gwr.sel(eval(parse(text=gwrFormula)), data = inputFile, adapt=T)

  # Generate the Geographically Weighted Regression model
  gwr.model <- gwr(eval(parse(text=gwrFormula)), data = inputFile, adapt=bw)

  # Extract SpatialDataFrame from gwr.model
  gwr_sdf <- gwr.model$SDF

  # set gwr shpFile directory
  setwd(gwrDirectoryPath)

  writeOGR(gwr_sdf, ".", outputFilename, driver="ESRI Shapefile")

}