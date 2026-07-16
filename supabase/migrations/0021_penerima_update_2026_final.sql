-- 0021_penerima_update_2026_final.sql
-- Final CATATAN UPDATE 2026 reconciliation. The 4 finished pondok stay VISIBLE
-- in the /penerima table (status 'selesai' -> red) and ON the map (faded green
-- dots). Reverses the earlier partial update that hid them. Also syncs the
-- home + penerima stat counters. Idempotent (matched by name).
-- Source: gdoc 16BHgxfZ77YxF3Q0z_IKwnsSRaM-XfIMWttmXCEe4lGE + spreadsheet
-- 1aVFguxnK7Bn4sHc9uE85VgjXO6kpsjHuGeevVfm2e-M (DATA DISTRIBUSI AIR 2026).

-- The 4 finished pondok: publish + selesai + on-map (coords restored/kept).
update public.penerima set sort_order=18, galon=6, status='selesai',
  lat=-7.925, lng=110.670, is_published=true where name='PP KI Ageng Wonokusumo';
update public.penerima set sort_order=19, galon=6, status='selesai',
  lat=-7.958, lng=110.612, is_published=true where name='PP Baitul Jannah Darussalam';
update public.penerima set sort_order=20, galon=5, status='selesai',
  lat=-7.950, lng=110.590, is_published=true where name='PP Assalafiyah Darussalam';
update public.penerima set sort_order=21, galon=8, status='selesai',
  lat=-7.958, lng=110.548, is_published=true where name='PP Al-Hikmah Gubuk Rubuh';

-- Stats (both groups): Kabupaten 1, Lembaga 21, Galon/Distribusi 1446, Kecamatan 9.
update public.stats set num=1    where label in ('Kabupaten','Kabupaten Aktif');
update public.stats set num=21   where label='Lembaga Penerima';
update public.stats set num=1446 where label='Galon/Distribusi';
update public.stats set num=9    where label in ('Kecamatan','Kecamatan Terjangkau');
