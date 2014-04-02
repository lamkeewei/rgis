func0 <- function(shapefile) {

  # load maptools library
  library(maptools)

  # read shapefile into r as spatial data frame
  input_shp <- readShapeSpatial(shapefile)

  # returns only the headers
  return(list(names(input_shp)))

}


func0 <- function(window_layer) {
  return("hello")
}