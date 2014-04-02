getshpheader <- function(shapefile) {

  # load maptools library
  library(maptools)

  # read shapefile into r as spatial data frame
  input_shp <- readShapeSpatial(shapefile)

  # returns only the headers
  return(names(input_shp))

}