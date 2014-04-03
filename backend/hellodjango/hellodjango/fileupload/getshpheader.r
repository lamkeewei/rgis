func0 <- function(shapefile) {

  # load maptools library
  library(maptools)

  # read shapefile into r as spatial data frame
  input_shp <- readShapeSpatial(shapefile)


  # returns only the headers of numeric columns
  mydata = input_shp@data
  nums <- sapply(mydata, is.numeric)

  return(list(names(mydata[ , nums])))

}


func0 <- function(window_layer) {
  return("hello")
}