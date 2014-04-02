func0 <- function(window_file, points_file){
    library(RJSONIO)
    library(maptools)
    library(spatstat)

    # read the shapefile into r as spatial data frame
    window_df <- readShapeSpatial(window_file)

    window_gdr <- as(window_df, "SpatialPolygons")

    # create the observation window
    window_owin <- as(window_gdr, "owin")
    # read shapefile into r as spatial data frame
    nm <- readShapeSpatial(points_file)

    # convert from spatial data frame to generic
    nmp <- as(nm, "SpatialPoints")

    #Convert the generic sp format into spatstat's pp format
    nm_ppp <- as(nmp, "ppp")

    # set the observation window
    nm_ppp <- nm_ppp[window_owin]

    E <- envelope(nm_ppp, Lest, nsim = 30)
    # plot(E, main="L-function")

    jsonoutput = toJSON(list(r=E$r, obs=E$obs, lo=E$lo, hi=E$hi), pretty=FALSE, collapse="")

    return(jsonoutput)
}