
CREATE TABLE ee_soa_test."eventLocale" (
	  id_event  		integer NOT NULL
	, id_language  		integer NOT NULL
	, description  		text NOT NULL
	, CONSTRAINT "pk_eventLocale" PRIMARY KEY (id_event, id_language)
	, CONSTRAINT "fk_eventLocale_event" FOREIGN KEY (id_event) REFERENCES ee_soa_test.event (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
	, CONSTRAINT "fk_eventLocale_language" FOREIGN KEY (id_language) REFERENCES ee_soa_test.language (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE ee_soa_test.event_image (
	  id_event  		integer NOT NULL
	, id_image  		integer NOT NULL
	, CONSTRAINT "pk_event_image" PRIMARY KEY (id_event, id_image)
	, CONSTRAINT "fk_event_image_event" FOREIGN KEY (id_event) REFERENCES ee_soa_test.event (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
	, CONSTRAINT "fk_event_image_image" FOREIGN KEY (id_image) REFERENCES ee_soa_test.image (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE
);
