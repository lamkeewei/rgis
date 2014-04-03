gwr_function <- function (inputFilePath, gwrFormula, gwrDirectoryPath, outputFilename) {

  library(maptools)
  library(spdep)
  library(spgwr)
  library(rgdal)
  # library(car)

  # Read in spatial shapefile
  inputFile <- readShapeSpatial(inputFilePath, CRS("+proj=longlat +datum=WGS84"))
  # print("inputFile")
  # significance = summary(lm(eval(parse(text=gwrFormula)), data = inputFile))

  # variance_inflation_factors = as.matrix(vif(lm(eval(parse(text=gwrFormula)), data = inputFile)))

  # Calculate the optimal bandwidth
  bw <- gwr.sel(eval(parse(text=gwrFormula)), data = inputFile, adapt=T)

  # Generate the Geographically Weighted Regression model
  gwr.model <- gwr(eval(parse(text=gwrFormula)), data = inputFile, adapt=bw)

  # gwr_coefficients_estimates = gwr.model
  # print("gwr_coefficients_estimates")
  # Extract SpatialDataFrame from gwr.model
  gwr_sdf <- gwr.model$SDF

  # set gwr shpFile directory
  setwd(gwrDirectoryPath)

  writeOGR(gwr_sdf, ".", outputFilename, driver="ESRI Shapefile")

  # get the output variable names
  variables = names(gwr_sdf)

  return(variables)

  #return(list(variables = variables, significance = significance, variance_inflation_factors = variance_inflation_factors))

  # return all the statistics
  # return(list(significance = significance, variance_inflation_factors = variance_inflation_factors, gwr_coefficients_estimates = gwr_coefficients_estimates, variables = variables))
}