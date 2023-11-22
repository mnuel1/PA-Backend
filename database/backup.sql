PGDMP                  
    {            pa-db    16.1    16.1 0    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    pa-db    DATABASE     �   CREATE DATABASE "pa-db" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "pa-db";
                postgres    false            �            1259    16400    pa_admin    TABLE     �  CREATE TABLE public.pa_admin (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    fullname character varying(250) NOT NULL,
    employment_id character varying(50) NOT NULL,
    office character varying(50) NOT NULL,
    image bytea,
    verify boolean DEFAULT false NOT NULL,
    contact character varying(100) DEFAULT 'default_value'::character varying NOT NULL
);
    DROP TABLE public.pa_admin;
       public         heap    postgres    false            �            1259    16399    pa_admin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pa_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.pa_admin_id_seq;
       public          postgres    false    216            �           0    0    pa_admin_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.pa_admin_id_seq OWNED BY public.pa_admin.id;
          public          postgres    false    215            �            1259    16463 	   pa_events    TABLE       CREATE TABLE public.pa_events (
    id integer NOT NULL,
    title character varying(100),
    description character varying(500),
    datentime timestamp without time zone NOT NULL,
    location character varying(100),
    reminder timestamp without time zone NOT NULL
);
    DROP TABLE public.pa_events;
       public         heap    postgres    false            �            1259    16462    pa_events_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pa_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.pa_events_id_seq;
       public          postgres    false    222            �           0    0    pa_events_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.pa_events_id_seq OWNED BY public.pa_events.id;
          public          postgres    false    221            �            1259    16415    pa_users    TABLE     �  CREATE TABLE public.pa_users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    fullname character varying(250) NOT NULL,
    employment_id character varying(50) NOT NULL,
    office character varying(50) NOT NULL,
    image bytea,
    verify boolean DEFAULT false NOT NULL,
    contact character varying(100) DEFAULT 'default_value'::character varying NOT NULL
);
    DROP TABLE public.pa_users;
       public         heap    postgres    false            �            1259    16472    pa_users_events    TABLE     ~   CREATE TABLE public.pa_users_events (
    id integer NOT NULL,
    user_id integer NOT NULL,
    event_id integer NOT NULL
);
 #   DROP TABLE public.pa_users_events;
       public         heap    postgres    false            �            1259    16471    pa_users_events_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pa_users_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.pa_users_events_id_seq;
       public          postgres    false    224            �           0    0    pa_users_events_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.pa_users_events_id_seq OWNED BY public.pa_users_events.id;
          public          postgres    false    223            �            1259    16414    pa_users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pa_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.pa_users_id_seq;
       public          postgres    false    218            �           0    0    pa_users_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.pa_users_id_seq OWNED BY public.pa_users.id;
          public          postgres    false    217            �            1259    16436    pa_users_notification    TABLE     �   CREATE TABLE public.pa_users_notification (
    id integer NOT NULL,
    user_id integer NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 )   DROP TABLE public.pa_users_notification;
       public         heap    postgres    false            �            1259    16435    pa_users_notification_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pa_users_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.pa_users_notification_id_seq;
       public          postgres    false    220            �           0    0    pa_users_notification_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.pa_users_notification_id_seq OWNED BY public.pa_users_notification.id;
          public          postgres    false    219            .           2604    16403    pa_admin id    DEFAULT     j   ALTER TABLE ONLY public.pa_admin ALTER COLUMN id SET DEFAULT nextval('public.pa_admin_id_seq'::regclass);
 :   ALTER TABLE public.pa_admin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            7           2604    16466    pa_events id    DEFAULT     l   ALTER TABLE ONLY public.pa_events ALTER COLUMN id SET DEFAULT nextval('public.pa_events_id_seq'::regclass);
 ;   ALTER TABLE public.pa_events ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            1           2604    16418    pa_users id    DEFAULT     j   ALTER TABLE ONLY public.pa_users ALTER COLUMN id SET DEFAULT nextval('public.pa_users_id_seq'::regclass);
 :   ALTER TABLE public.pa_users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            8           2604    16475    pa_users_events id    DEFAULT     x   ALTER TABLE ONLY public.pa_users_events ALTER COLUMN id SET DEFAULT nextval('public.pa_users_events_id_seq'::regclass);
 A   ALTER TABLE public.pa_users_events ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            4           2604    16439    pa_users_notification id    DEFAULT     �   ALTER TABLE ONLY public.pa_users_notification ALTER COLUMN id SET DEFAULT nextval('public.pa_users_notification_id_seq'::regclass);
 G   ALTER TABLE public.pa_users_notification ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �          0    16400    pa_admin 
   TABLE DATA           z   COPY public.pa_admin (id, username, email, password, fullname, employment_id, office, image, verify, contact) FROM stdin;
    public          postgres    false    216   �:       �          0    16463 	   pa_events 
   TABLE DATA           Z   COPY public.pa_events (id, title, description, datentime, location, reminder) FROM stdin;
    public          postgres    false    222   �;       �          0    16415    pa_users 
   TABLE DATA           z   COPY public.pa_users (id, username, email, password, fullname, employment_id, office, image, verify, contact) FROM stdin;
    public          postgres    false    218   %<       �          0    16472    pa_users_events 
   TABLE DATA           @   COPY public.pa_users_events (id, user_id, event_id) FROM stdin;
    public          postgres    false    224   �<       �          0    16436    pa_users_notification 
   TABLE DATA           W   COPY public.pa_users_notification (id, user_id, message, read, created_at) FROM stdin;
    public          postgres    false    220   #=       �           0    0    pa_admin_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.pa_admin_id_seq', 2, true);
          public          postgres    false    215            �           0    0    pa_events_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.pa_events_id_seq', 4, true);
          public          postgres    false    221            �           0    0    pa_users_events_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.pa_users_events_id_seq', 7, true);
          public          postgres    false    223            �           0    0    pa_users_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.pa_users_id_seq', 3, true);
          public          postgres    false    217            �           0    0    pa_users_notification_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.pa_users_notification_id_seq', 1, true);
          public          postgres    false    219            :           2606    16411    pa_admin pa_admin_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.pa_admin
    ADD CONSTRAINT pa_admin_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.pa_admin DROP CONSTRAINT pa_admin_email_key;
       public            postgres    false    216            <           2606    16413 #   pa_admin pa_admin_employment_id_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.pa_admin
    ADD CONSTRAINT pa_admin_employment_id_key UNIQUE (employment_id);
 M   ALTER TABLE ONLY public.pa_admin DROP CONSTRAINT pa_admin_employment_id_key;
       public            postgres    false    216            >           2606    16407    pa_admin pa_admin_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.pa_admin
    ADD CONSTRAINT pa_admin_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.pa_admin DROP CONSTRAINT pa_admin_pkey;
       public            postgres    false    216            @           2606    16409    pa_admin pa_admin_username_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.pa_admin
    ADD CONSTRAINT pa_admin_username_key UNIQUE (username);
 H   ALTER TABLE ONLY public.pa_admin DROP CONSTRAINT pa_admin_username_key;
       public            postgres    false    216            L           2606    16470    pa_events pa_events_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.pa_events
    ADD CONSTRAINT pa_events_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.pa_events DROP CONSTRAINT pa_events_pkey;
       public            postgres    false    222            B           2606    16426    pa_users pa_users_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.pa_users
    ADD CONSTRAINT pa_users_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.pa_users DROP CONSTRAINT pa_users_email_key;
       public            postgres    false    218            D           2606    16428 #   pa_users pa_users_employment_id_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.pa_users
    ADD CONSTRAINT pa_users_employment_id_key UNIQUE (employment_id);
 M   ALTER TABLE ONLY public.pa_users DROP CONSTRAINT pa_users_employment_id_key;
       public            postgres    false    218            N           2606    16477 $   pa_users_events pa_users_events_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.pa_users_events
    ADD CONSTRAINT pa_users_events_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.pa_users_events DROP CONSTRAINT pa_users_events_pkey;
       public            postgres    false    224            J           2606    16445 0   pa_users_notification pa_users_notification_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.pa_users_notification
    ADD CONSTRAINT pa_users_notification_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.pa_users_notification DROP CONSTRAINT pa_users_notification_pkey;
       public            postgres    false    220            F           2606    16422    pa_users pa_users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.pa_users
    ADD CONSTRAINT pa_users_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.pa_users DROP CONSTRAINT pa_users_pkey;
       public            postgres    false    218            H           2606    16424    pa_users pa_users_username_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.pa_users
    ADD CONSTRAINT pa_users_username_key UNIQUE (username);
 H   ALTER TABLE ONLY public.pa_users DROP CONSTRAINT pa_users_username_key;
       public            postgres    false    218            P           2606    16483 -   pa_users_events pa_users_events_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pa_users_events
    ADD CONSTRAINT pa_users_events_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.pa_events(id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.pa_users_events DROP CONSTRAINT pa_users_events_event_id_fkey;
       public          postgres    false    4684    222    224            Q           2606    16478 ,   pa_users_events pa_users_events_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pa_users_events
    ADD CONSTRAINT pa_users_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.pa_users(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.pa_users_events DROP CONSTRAINT pa_users_events_user_id_fkey;
       public          postgres    false    4678    218    224            O           2606    16446 8   pa_users_notification pa_users_notification_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pa_users_notification
    ADD CONSTRAINT pa_users_notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.pa_users(id) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public.pa_users_notification DROP CONSTRAINT pa_users_notification_user_id_fkey;
       public          postgres    false    220    4678    218            �   �   x�}�;�0�z}
� "���@P�F�V�ZNd������"���i��ޛA(OS���h��ށ�hH�c|���\ ?Y7��N��1$
�hP�1�$h3��v�Dt]2��w~��6��z���!� �j]�_m�{��BC      �   �   x�3�t-K�+Q0�tI-N.�,(���SH�/R����*�Z �O~r"X!L�P��@��"�e5���FCMA��QE�6Q02�j54$�$'�F2�#�C���Wbh	W����� ~DL      �   �   x�}��
�0�s�{Y�-�7�A^#�)6�k矷��]H���)���s�s��'�ׁ}�S�l�+�����G��F�,K�Lt�}qt.�=�ˎ�!uwf�$�ϯ�}������vL�6Ӕx�жOS�{t(�2�4�ԵVZ拺�+u�lK4ؘJq��ҧ�7�]!���J�      �   &   x�3�4�4�2�4��@���4�2��p��qqq Ki+      �   ?   x�3�4��/U/JU��/W(K-�L�LM�,�4202�54�52T00�20�21�354����� �YX     