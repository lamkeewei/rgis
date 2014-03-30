KDE_function <-function (windowLayer, pointLayer, bandwidth) {
  str(windowLayer)
  str(pointLayer)
  bandwidth
  # load maptools library
  library(maptools)
  library(spatstat)
  library(RJSONIO)
  spatstat.options(checkpolygons=FALSE)


  loadOwin <- function(filename){
    x <- readShapePoly(filename)
    return(as.owin(x))
  }

  loadPoints <- function(filename, owin){
    x <- readShapePoints(filename)
    x <- as(x, "ppp")
    x <- unmark(x)
    x <- x[owin]

    return(x)
  }

  y <- loadOwin(windowLayer)
  x <- loadPoints(pointLayer, y)

  #Convert the generic sp format into spatstat's pp format
  nm_ppp <- as(x, "ppp")

  #Compute KDE
  kde_nm_bandwidth <- density(nm_ppp,bandwidth)
  matrix<-as.matrix.im(kde_nm_bandwidth)

  return(toJSON(list(yrow=kde_nm_bandwidth$yrow,xcol=kde_nm_bandwidth$xcol,matrix=matrix)))

}