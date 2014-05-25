


CREATE TABLE ee_soa_test.event (
      id  				serial NOT NULL
    , id_venue 			integer NOT NULL
	, title  			character varying(200) NOT NULL
	, startdate 		timestamp without time zone NOT NULL
	, enddate 			timestamp without time zone
	, canceled 			boolean
	, CONSTRAINT "pk_event" PRIMARY KEY (id)
	, CONSTRAINT "fk_event_venue" FOREIGN KEY (id_venue) REFERENCES ee_soa_test.venue (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
);
