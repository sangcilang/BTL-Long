-- Table: public.bacgiang

-- DROP TABLE IF EXISTS public.bacgiang;

CREATE TABLE IF NOT EXISTS public.bacgiang
(
    gid integer NOT NULL DEFAULT nextval('bacgiang_gid_seq'::regclass),
    id_0 double precision,
    iso character varying(3) COLLATE pg_catalog."default",
    name_0 character varying(75) COLLATE pg_catalog."default",
    id_1 double precision,
    name_1 character varying(75) COLLATE pg_catalog."default",
    id_2 double precision,
    name_2 character varying(75) COLLATE pg_catalog."default",
    hasc_2 character varying(15) COLLATE pg_catalog."default",
    ccn_2 double precision,
    cca_2 character varying(254) COLLATE pg_catalog."default",
    type_2 character varying(50) COLLATE pg_catalog."default",
    engtype_2 character varying(50) COLLATE pg_catalog."default",
    nl_name_2 character varying(75) COLLATE pg_catalog."default",
    varname_2 character varying(150) COLLATE pg_catalog."default",
    geom geometry(MultiPolygon,4326),
    population integer,
    CONSTRAINT bacgiang_pkey PRIMARY KEY (gid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.bacgiang
    OWNER to postgres;
-- Index: bacgiang_geom_idx

-- DROP INDEX IF EXISTS public.bacgiang_geom_idx;

CREATE INDEX IF NOT EXISTS bacgiang_geom_idx
    ON public.bacgiang USING gist
    (geom)
    WITH (fillfactor=90, buffering=auto)
    TABLESPACE pg_default;