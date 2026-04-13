<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha Clínica - {{ $patient['last_name'] }} {{ $patient['first_name'] }}</title>
    <style>
        /* Aquí puedes poner tus estilos personalizados */
        body {
            font-family: sans-serif;
            /* color: #333; */
            /* border: solid 1px orange; */

        }
        .main{
          /* border: solid 1px black; */
          width: 13cm;  /*Variar para tamaño de hoja width = height*/
          height: 13cm; /*Variar para tamaño de hoja*/
          margin-left: -20px;
          margin-top: -20px; /*Variar para hoja oficio*/
          transform: rotate(-90deg)
        }

        .content .nhc {
          /* border: 1px solid red; */
          width: 100%;
          text-align: right;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .content .header {
          margin-top: 5px;
          text-align: center;
          border-bottom: 2px solid black;
          /* border: 1px solid skyblue; */
        }
        .content .header .empresa {
          font-size: 0.9rem;
        }
        .content .header .title {
          margin-top: 10px;
          padding-bottom: 10px;
          font-size: 1.2rem;
          font-weight: bold
        }

        .content .table-wrapper {
          margin-left: 10px;
          margin-right: 10px;
          /* border: 1px solid red; */
        }
        .content .table-wrapper .table {
          margin-top: 5px;
          /* border: 1px solid green; */
          border-collapse: collapse;
          width: 100%;
        }
        table tr {
          border: 1px
        }

        .italic{
            font-style: italic
        }
        .font-09{
            font-size: 0.9rem;
        }
        .font-08{
            font-size: 0.8rem;
        }


        .color-gray {
          color: darkblue;
        }

        .info-grid {
            /* display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px; */
        }

        .info-item {
            border-bottom: 1px solid #e2e8f0;
            padding: 5px 0;
        }

        /* ... más estilos para el resto de la ficha */


    </style>
</head>
<body>
  <div class="main">
    <div class="content">
      <div class="nhc">
        <div>NHC {{ $patient['nhc'] }}</div>
      </div>
      <div class="header">
          <div class="empresa">
            <div>CONGREGACIÓN NUESTRA SEÑORA DE LA PAZ</div>
            <div>POLICLÍNICO REYNA DE LA PAZ</div>
          </div>
          <div class="title">HISTORIA CLÍNICA</div>
      </div>
      <div class="table-wrapper">
        <table>
          <tr>
            <td colspan="12">
              <div class="font-09 italic color-gray">Apellidos y nombres</div>
            </td>
          </tr>
          <tr style="height: 20px">
            <td colspan="12">
              <div style="margin-bottom: 5px;">{{ $patient['last_name'] }}, {{ $patient['first_name'] }}</div>
            </td>
          </tr>
          <tr>
            <td colspan="12">
              <div class="font-09 italic color-gray">Fecha y lugar de nacimiento</div>
            </td>
          </tr>
          <tr>
            <td colspan="12">
              <div class="font-09" style="margin-bottom: 5px;">
                {{$patient['birth_date'] ? \Carbon\Carbon::parse($patient['birth_date'])->format('d/m/Y') : 'S/fn'}} - SAN FRANCISCO DE DAGUAS - CHACHAPOYAS - AMAZONAS | PERU
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4" style="vertical-align: top;">
              <div class="font-09" style="margin-bottom: 5px;">
                <span class="italic color-gray">{{ $patient['identity']['name'] ?? 'Sin documento' }} </span>{{$patient['identity_number'] ?? ''}}
              </div>
            </td>
            <td colspan="8">
              <div class="font-09" style="margin-bottom: 5px;">
                <span class="italic color-gray">Teléfono </span>{{$patient['phone'] ?? ''}}
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="12">
              <div class="font-09 italic color-gray">Domicilio</div>
            </td>
          </tr>
          <tr>
            <td colspan="12">
              <div class="font-09">{{ $patient['address'] }}</div>
            </td>
          </tr>
          <tr>
            <td colspan="12">
              <div class="font-09" style="margin-bottom: 5px;">{{$patient['location_address']['location_name'] ?? ''}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="12">
              <div class="font-09">
                <span class="italic color-gray">Fecha de ingreso </span>{{ \Carbon\Carbon::parse($patient['entry_at'])->format('d/m/Y') }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</body>
</html>